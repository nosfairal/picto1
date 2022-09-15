<?php

namespace App\Controller\Admin;

use App\Entity\Pictogram;
use App\Entity\SubCategory;
use App\Entity\Therapist;
use App\Form\SearchType;
use App\Classe\Search;
use App\Form\CreateSubCategoryType;
use App\Form\CreatePictogramType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\PictogramRepository;
use App\Repository\SubCategoryRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

Class SubCategoryController extends AbstractController
{
    /**
     * @Route("admin/subcategory")
     */
    /**
     * @var SubCategoryRepository
     */
    private $repository;
    /**
     * @var EntityManagerInterface
     */
    private $em;

    public function __construct(SubCategoryRepository $repository, EntityManagerInterface $em)
    {
        $this->repository = $repository;
        $this->em = $em;
    }

    /**
     * @Route("admin/subcategory", name="subcategory")
     * @return \Symfony\Component\HttpFoundation\Response
     */

    /**
     * @Route("admin/newSubCategory", name="newSubCategory")
     * @IsGranted("ROLE_SUPER_ADMIN")
     */
    public function addSubCategory (Request $request): Response
    {
        $subcategory = new SubCategory();
        $form = $this->createForm(CreateSubCategoryType::class, $subcategory);
        $form->handleRequest($request);

        $therapistId=$this->em->getRepository(Therapist::class)->find($this->getUser()->getId());
        $subcategory->setTherapistId($therapistId);

        if ($form->isSubmitted() && $form->isValid()) {
            $subcategory = $form->getData();
            $this->em->persist($subcategory);
            $this->em->flush();
            $this->addFlash('success', 'Sous catégorie créé avec succès');
            return $this->redirectToRoute('category');
        }

        return $this->render('subcategory/createSubCategory.html.twig', [
            'subcategory' => $subcategory,
            'form' => $form->createView()
        ]);
    }
    
    /**
     * @Route("/admin/subcategory/{id}", name="admin.subcategory.delete", methods="DELETE")
     * @param SubCategory $subcategory
     * @return Response
     */
    public function delete(SubCategory $subcategory, Request $request, PictogramRepository $pictogramRepository)
    {

        $id = $subcategory->getId();
        $pictogram = $pictogramRepository->findByCategory($id);


        if (!empty ($pictogram)) {
            $this->addFlash('alert', "Des pictogrammes sont déjà associés à cette sous-catégorie. Supprimez d'abord les pictogrammes.");
        } else {

            if ($this->isCsrfTokenValid('delete' . $subcategory->getId(), $request->get('_token'))) {
                $this->em->remove($subcategory);
                $this->em->flush();
                $this->addFlash('success', 'Sous-Catégorie supprimée avec succès');
                return $this->redirectToRoute('subcategory');
            }
        }
        return $this->redirectToRoute('subcategory');
    }


    /**
     * @Route("/admin/pictogram/{id}", name="admin.pictogram.delete", methods="DELETE")
     * @param Pictogram $pictogram
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function deletePicto(Pictogram $pictogram, Request $request) {
        if ($this->isCsrfTokenValid('delete1' . $pictogram->getId(), $request->get('_token'))) {
            $this->em->remove($pictogram);
            $this->em->flush();
            $this->addFlash('success', 'Pictogramme supprimé avec succès');
        }
        return $this->redirectToRoute('category');
    }

}